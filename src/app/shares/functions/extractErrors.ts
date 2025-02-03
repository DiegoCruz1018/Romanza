export function extractErrors(obj: any): string[]{
    const err = obj.errors.error;   

    let errorMessages: string[] = [];

    for(let key in err){
        let file = key;

        const messagesWithFiles = err[key].map((message: string) => `${file}: ${message}`);

        errorMessages = errorMessages.concat(messagesWithFiles);
    }

    return errorMessages;
}