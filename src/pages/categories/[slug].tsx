import { client } from "@/lib/prismic";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from 'next/router';
import Link from 'next/link';

import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

interface CategoryProps {
    category: Document;
    products: Document[];
}

export default function Category({ products, category }: CategoryProps) {
    const router = useRouter();

    if (router.isFallback) {
        return <p>Carregando...</p>
    }

    return (
        <div>
            <h1>{PrismicDOM.RichText.asText(category.data.title)}</h1>

            <ul>
                {products.map(item => {
                    return (
                        <li key={item.id}>
                            <Link href={`/categories`}>
                                <a>
                                    {PrismicDOM.RichText.asText(item.data.title)}
                                </a>
                            </Link>

                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const categories = await client().query([
        Prismic.Predicates.at('document.type', 'category')
    ]);

    const paths = categories.results.map(item => {
        return {
            params: { slug: item.uid }
        }
    });

    return {
        paths,
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
    const { slug } = context.params;

    const category = await client().getByUID('category', String(slug), {});
    const products = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.at('my.product.category', category.id)
    ]);

    return {
        props: {
            category,
            products: products.results
        },
        revalidate: 60
    }
}