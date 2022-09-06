export const handler = async(event:any, context: any) => {
    console.log('Received Event', JSON.stringify(event));
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hello World!!!"})
    }
}