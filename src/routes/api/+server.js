let keys = [];

// Post is uploading NEW content
export const POST = async( { request } ) => {
    if (request.headers.get('ascii')) keys = [...keys, request.headers.get('ascii')];
    console.log(keys);
    return new Response();
}

// Put is updating EXISTING content
export const PUT = async( { request } ) => {

}

// GET is retrieving content
export const GET = async( { request } ) => {
    return new Response(JSON.stringify(keys));
}