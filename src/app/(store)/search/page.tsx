import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { api } from "@/data/api";

import { Product } from "@/data/types/products";

interface SearchProps {
  searchParams: {
    q: string;
  };
}

async function searchProducts(query: string) {
  const response = await api(`/products/search?q=${query}`, {
    next: {
      revalidate: 60 * 60,
    },
  });

  const products = await response.json();

  return products;
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams;

  if (!query) {
    redirect("/");
  }

  const products = await searchProducts(query);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">{query}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product: Product) => {
          return (
            <Link
              key={product.id}
              href={`/product/name`}
              className="
                group
                relative
                rounded-lg
                bg-zinc-900
                overflow-hidden
                flex
                justify-center
                items-end
              "
            >
              <Image
                alt=""
                src={product.image}
                width={480}
                height={480}
                quality={100}
                className="group-hover:scale-105 transition-transform duration-500"
              />

              <div
                className="
                absolute
                bottom-28
                right-28
                h-12
                flex
                items-center
                gap-2
                max-w-[280px]
                rounded-full
                border-2
                border-zinc-500
                bg-black/80
                p-1
                pl-5
              "
              >
                <span className="text-sm truncate">{product.description}</span>
                <span
                  className="
                    flex
                    h-full
                    items-center
                    justify-center
                    rounded-full
                    bg-violet-500
                    px-5
                    font-semibold
                  "
                >
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
