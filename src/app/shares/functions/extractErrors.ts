export function extractErrors(obj: any): string[]{

    if (!obj || !obj.error || !obj.error.errors) {
        return ['Error desconocido'];
    }

    const err = obj.error.errors;   

    let errorMessages: string[] = [];

    for(let key in err){
        let file = key;

        //const messagesWithFiles = err[key].map((message: string) => `${file}: ${message}`);

        const messageErr = err[key].map((message: string) => `${message}`);

        //errorMessages = errorMessages.concat(messagesWithFiles);

        errorMessages = errorMessages.concat(messageErr);
    }

    return errorMessages;
}