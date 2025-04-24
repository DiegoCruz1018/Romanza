export function extractErrorsIdentity(obj: any): string[]{

    let errorMessages: string[] = [];

    for(let i=0; i<obj.error.length; i++){

        const element = obj.error[i];

        errorMessages.push(element.description);
    }

    //console.log(errorMessages);
    return errorMessages;
}