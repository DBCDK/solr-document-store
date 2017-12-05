export default {
    fetchBibliographicPost(searchTerm){
        return fetch('api/getBibliographicRecord/'+encodeURIComponent(searchTerm))
            .then((res)=>{
                if(res.status === 200)
                    return res.json();
                else
                if(res.status === 400)
                    throw new Error("Input error, server failed to URL decode bibliographicRecordId");
                else
                    throw new Error("Error with http status code: "+res.status);
            });
    }
}