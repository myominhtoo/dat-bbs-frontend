export class HttpResponse<T> {
    timestamp !: Date;
    httpStatus !: string;
    httpStatusCode !: number;
    message !: string;
    reason !: string;
    ok !: boolean;
    data !: T;
}