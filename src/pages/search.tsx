import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Link from 'next/link';

import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import PrismicDOM from 'prismic-dom';
import { client } from "@/lib/prismic";

interface SearchProps {
    searchResults: Document[];
}

export default function Search({ searchResults }: SearchProps) {
    const router = useRouter();
    const [search, setSearch] = useState('');

    function handleSearch(e: FormEvent) {
        e.preventDefault();

        router.push(
            `/search?q=${encodeURIComponent(search)}`
        )

        setSearch('');
    }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} />

                <button type='submit'>Search</button>
            </form>

            <ul>
                {
                    searchResults.map(item => {
                        return (
                            <li key={item.id}>
                                <Link href={`/products/${item.uid}`}>
                                    <a>
                                        {PrismicDOM.RichText.asText(item.data.title)}
                                    </a>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
    const { q } = context.query;

    if (!q) {
        return { props: { searchResults: [] } };
    }

    const searchResults = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.fulltext('my.product.title', String(q))
    ]);

    return {
        props: {
            searchResults: searchResults.results
        }
    }
}