import useSWR from 'swr'

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())

export function Stats() {
    const { data, error } = useSWR('/api/contacts', fetcher)
    console.log("data", data)
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    return <div>hello {data[0].name}</div>
}
