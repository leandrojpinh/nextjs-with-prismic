import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

import { client } from '@/lib/prismic';
import SEO from '@/components/SEO';

interface IHomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: IHomeProps) {
  return (
    <div>
      <SEO title={'O seu ecommerce top'} shouldExcludeTitleSuffix />
      <section>
        <h1>Products</h1>
        <ul>
          {
            recommendedProducts.map(item => {
              return (
                <li key={item.id}>
                  <Link href={`/products/${item.uid}`}>
                    <a>~
                      {PrismicDOM.RichText.asText(item.data.title)}
                    </a>
                  </Link>
                </li>
              )
            })
          }
        </ul>

      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results
    }
  }
}