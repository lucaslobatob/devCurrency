import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CoinProps } from '../home';

interface ResponseData {
    data: CoinProps;
}

interface ErrorData {
    error: string;
}

type DataProps = ResponseData | ErrorData;

export function Detail() {
    const { cripto } = useParams();
    const navigate = useNavigate();

    const [coin, setCoin] = useState<CoinProps>()

    useEffect(() => {
        async function getCoin() {
            try {
                fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=1b154ede9827513daca04079c67da289b30d44f7125313845f791728efa238d9`)
                    .then(response => response.json())
                    .then((data: DataProps) => {
                        if ("error" in data) {
                            navigate('/');
                            return;
                        }

                        const price = Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD"
                        })

                        const priceCompact = Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            notation: "compact",
                        })

                        const resultData = {
                            ...data.data,
                            formatedPrice: price.format(Number(data.data.priceUsd)),
                            formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
                            formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
                        }

                        setCoin(resultData);

                    })
            } catch (error) {
                navigate('/');
            }
        }

        getCoin();
    }, [cripto]);

    return (
        <div>
            <h1>Página Detalhe da {cripto}</h1>
        </div>
    )
}