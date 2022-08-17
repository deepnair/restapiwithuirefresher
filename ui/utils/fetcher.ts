const fetcher = async <T>(url: string, headers = {}): Promise<T|null> => {
    try{
        const res = await fetch(url, {credentials: 'include'})
        return await res.json()
    }catch(e:any){
        return null
    }
}

export default fetcher