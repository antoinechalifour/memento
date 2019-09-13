declare module 'parse-curl' {
  interface Headers {
    [key: string]: string;
  }
  type Method =
    | 'get'
    | 'GET'
    | 'post'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'head'
    | 'HEAD'
    | 'delete'
    | 'DELETE'
    | 'options'
    | 'OPTIONS'
    | 'patch'
    | 'PATCH';

  interface ParsedCurl {
    method: Method;
    url: string;
    header: Headers;
    body: string;
  }

  function parseCurl(curl: string): ParsedCurl;
  export = parseCurl;
}
