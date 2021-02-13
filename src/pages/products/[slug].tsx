import { client } from "@/lib/prismic";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

interface ProducProps {
    product: Document;
}

export default function Product({ product }: ProducProps) {
    const router = useRouter();
    const [idAddCart, setIsAddCart] = useState(false);

    function handleAddCart() {
        setIsAddCart(true);
    }

    if (router.isFallback) {
        return <p>Carregando...</p>
    }

    return (
        <div>
            <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>

            <img src={product.data.thumbnail.url} width={300} alt="imagem" />

            <div dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(product.data.description) }}></div>

            <p>Price: ${product.data.price}</p>

        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<ProducProps> = async (context) => {
    const { slug } = context.params;

    const product = await client().getByUID('product', String(slug), {});

    return {
        props: {
            product
        },
        revalidate: 60
    }
}