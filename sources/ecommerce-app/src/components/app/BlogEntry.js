/*
 * MIT License
 *
 * Copyright (c) 2022 Crafter Software Corporation. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { CategoryListing } from './BlogRoll';
import { Link } from 'react-router-dom';
import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { getProducts, useProductsQuery } from '../../util/products';
import { useCategories, usePosts } from '../shared/hooks';
import { RenderField, Field, ExperienceBuilder } from '@craftercms/experience-builder/react';
import { isAuthoring } from '../shared/utils';

export default function BlogEntry(props) {
  const slug = props.match.params.slug;

  const categories = useCategories();

  const [paginationData] = useState({
    itemsPerPage: 1,
    currentPage: 0
  });
  const post = usePosts(paginationData, slug);

  return <ExperienceBuilder
    isAuthoring={isAuthoring()}
    path={post?.items[0].craftercms.path}
  >
    <Layout>
      <Container>
        <Row>
          {
            post &&
            <Col md={9}>
              <Card>
                <CardBody>
                  <Post post={post.items[0]}/>
                </CardBody>
              </Card>
            </Col>
          }
          <Col md={3}>

            <CategoryListing categories={categories}/>
            {
              post &&
              <>
                <RelatedPosts categories={post.items[0].categories_o} slug={slug}/>
                <RelatedProducts categories={post.items[0].categories_o}/>
              </>
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  </ExperienceBuilder>
}

function Post({ post }) {
  const { title_s, image_s, author_s, subtitle_s, content_html_raw, categories_o } = post;
  return (
    <>
      <Field component="section" className="post__head" model={post}>
        <RenderField
          component="h1"
          model={post}
          fieldId="title_s"
          className="post__title"
        >
          {title_s}
        </RenderField>
        {
          subtitle_s &&
          <RenderField
            component="p"
            model={post}
            fieldId="subtitle_s"
            className="post__subtitle"
          >
            {subtitle_s}
          </RenderField>
        }
        {
          author_s &&
          <RenderField
            component="p"
            model={post}
            fieldId="author_s"
            className="post__author"
          >
            {author_s}
          </RenderField>
        }
      </Field>
      {
        image_s &&
        <Field
          component="img"
          renderTarget="src"
          className="post__image"
          model={post}
          fieldId="image_s"
          src={image_s}
          alt=""
        />
      }
      <Field
        model={post}
        fieldId="content_html"
        className="post__body"
        dangerouslySetInnerHTML={{ __html: content_html_raw }}
      />
      <div className="post__categories">{categories_o.map((item) => item.value_smv).join(', ')}</div>
    </>
  );
}

function RelatedPosts({ categories, slug }) {
  const [relatedPosts, setRelatedPosts] = useState();
  useEffect(
    () => {
      ajax.post(
        process.env.REACT_APP_GRAPHQL_SERVER,
        {
          query: `query {
            posts: component_post (limit: 3, sortOrder: ASC, sortBy: "title_s") {
              items {
                title_s
                image_s
                slug_s(filter: { not: [{ equals: "${slug}" }]})
                categories_o @skip(if: true) {
                  item {
                    key(filter: {matches: "${categories[0].key}"})
                  }
                }
              }
            }
          }`
        },
        { 'Content-Type': 'application/json; charset=UTF-8' }
      ).pipe(
        map(({ response }) => (response.data.posts.items)),
        catchError((response) => of(response)),
      ).subscribe(posts => setRelatedPosts(posts));
    },
    [slug, categories]
  );
  return (
    relatedPosts ? <div className="blog__sidebar-bar-block">
      <h2 className="blog__side-bar-title">Related Posts</h2>
      <nav className="blog__side-bar-list">
        {
          relatedPosts.map(({ title_s, image_s, slug_s }) =>
            <Link key={slug_s} className="blog__side-bar-item" to={`/blog/${slug_s}`}>
              <img src={image_s} alt=""/>
              <h3 className="blog__related-post-title">{title_s}</h3>
            </Link>
          )
        }
      </nav>
    </div> : <></>
  );
}

function RelatedProducts({ categories }) {
  const [items, setItems] = useState();
  const params = useProductsQuery();
  useEffect(
    () => {
      getProducts({ limit: 3, offset: Math.floor(Math.random() * 11), ...params })
        .subscribe(({ response }) => setItems(response.items));
    },
    // TODO: adding params is creating a loop
    // eslint-disable-next-line
    [categories, params.locale, params.currency]
  );
  return (
    items ? <div className="blog__sidebar-bar-block">
      <h2 className="blog__side-bar-title">Related Products</h2>
      <nav className="blog__side-bar-list">
        {
          items.map(({ id, variants, name }) =>
            <Link key={id} className="blog__side-bar-item blog__side-bar-item--horizontal" to={`/catalog/${id}`}>
              <img className="blog__side-bar-item-image" src={variants[0].images[0].url} alt=""/>
              <h3 className="blog__related-post-title">{name}</h3>
            </Link>
          )
        }
      </nav>
    </div> : <></>
  );
}
