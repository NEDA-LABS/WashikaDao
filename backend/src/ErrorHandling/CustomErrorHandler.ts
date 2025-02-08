interface CustomErrorDetails {
    errTime: Date;
    errMsg: string;
    errDetails?: string;
}
export function CreateCustomErrMsg(err: any,error?: Error): CustomErrorDetails {
    let errTime: Date = new Date();
    let defaultErrMsg: string = "Unfortunately, an unexpected error occurred"
    let errMsg: any;
    let errDetails: any;

        if(err.stack) {
    let errDetails = err.stack;
    }

    if (error instanceof Error) {
     let errMsg = error;
    }

   return {
        errTime,
        errDetails,
        errMsg
    }
}

