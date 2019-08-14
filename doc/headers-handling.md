# General Headers
- Both request / response
- No relation with the data

# Request Headers
- Information about the data to be fetched

# Response Headers
- Additional information about the response

# End to end headers

# Hop by hop headers

From:
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization
- https://www.freesoft.org/CIE/RFC/2068/143.htm

| Category              | Header                              | Forward     | Comments                          | Type     |
| --------------------- | ----------------------------------- | ----------- | --------------------------------- | -------- |
| Authentication        | WWW-Authenticate                    | Yes         |                                   | Response |
| Authentication        | Authorization                       | Yes         |                                   | Request  |
| Authentication        | Proxy-Authenticate                  | No          |                                   | Request  |
| Authentication        | Proxy-Authorization                 | Yes         |                                   | Request  |
| Caching               | Age                                 | Yes         |                                   | Response |
| Caching               | Cache-Control                       | Yes         |                                   | Response |
| Caching               | Clear-Site-Data                     | Yes         |                                   | Response |
| Caching               | Expires                             | Yes         |                                   | Response |
| Caching               | Pragma                              | Yes         |                                   | Response |
| Caching               | Warning                             | Yes         |                                   | Response |
| Conditionals          | Last-Modified                       | Yes         |                                   | Response |
| Conditionals          | ETag                                | Yes         |                                   | Response |
| Conditionals          | If-Match                            | Yes         |                                   | Response |
| Conditionals          | If-None-Match                       | Yes         |                                   | Response |
| Conditionals          | If-Modified-Match                   | Yes         |                                   | Response |
| Conditionals          | If-Unmodified-Match                 | Yes         |                                   | Response |
| Conditionals          | Vary                                | Yes         |                                   | Response |
| Connection Management | Connection                          | No          |                                   | Response |
| Connection Management | Keep-Alive                          | No          |                                   | Response |
| Content Negociation   | Accept                              | Yes         |                                   | Request  |
| Content Negociation   | Accept-Charset                      | Yes         |                                   | Request  |
| Content Negociation   | Accept-Encoding                     | Not for now |                                   | Request  |
| Content Negociation   | Accept-Language                     | Yes         |                                   | Request  |
| Controls              | Expect                              | Yes         |                                   | Request  |
| Cookies               | Cookie                              | Yes         |                                   | Request  |
| Cookies               | Set-Cookie                          | Yes         |                                   | Response |
| CORS                  | Access-Control-Allow-Origin         | No          | CORS will be handled by memento   | Response |
| CORS                  | Access-Control-Allow-Credentials    | No          | CORS will be handled by memento   | Response |
| CORS                  | Access-Control-Allow-Headers        | No          | CORS will be handled by memento   | Response |
| CORS                  | Access-Control-Allow-Methods        | No          | CORS will be handled by memento   | Response |
| CORS                  | Access-Control-Expose-Headers       | No          | CORS will be handled by memento   | Response |
| CORS                  | Access-Control-Max-Age              | No          | CORS will be handled by memento   | Response |
| CORS                  | Access-Control-Request-Headers      | No          | CORS will be handled by memento   | Response |
| CORS                  | Access-Control-Request-Method       | No          | CORS will be handled by memento   | Response |
| CORS                  | Origin                              | No          | CORS will be handled by memento   | Response |
| Tracking              | DNT                                 | Yes         |                                   | Request  |
| Tracking              | Tk                                  | Yes         |                                   | Request  |
| Downloads             | Content-Disposition                 | Yes         |                                   | Response |
| Body Information      | Content-Length                      | Yes         |                                   | Response |
| Body Information      | Content-Type                        | Yes         |                                   | Response |
| Body Information      | Content-Encoding                    | Not for now |                                   | Response |
| Body Information      | Content-Language                    | Yes         |                                   | Response |
| Body Information      | Content-Location                    | Yes         |                                   | Response |
| Redirect              | Location                            | Yes         |                                   | Response |
| Proxies               | Forwarded                           | No          | Will contain info about memento   | Response |
| Proxies               | Via                                 | No          | Will contain info about memento   | Response |
| Request Context       | From                                | Yes         |                                   | Request  |
| Request Context       | Host                                | No          |                                   | Request  |
| Request Context       | Referer                             | Yes         |                                   | Request  |
| Request Context       | Referrer-Policy                     | Yes         |                                   | Request  |
| Request Context       | User-Agent                          | Yes         |                                   | Request  |
| Response Context      | Allow                               | Yes         |                                   | Response |
| Response Context      | Server                              | Yes         |                                   | Response |
| Range Requests        | Accept-Ranges                       | Yes         |                                   | Request  |
| Range Requests        | Range                               | Yes         |                                   | Request  |
| Range Requests        | If-Range                            | Yes         |                                   | Request  |
| Range Requests        | Content-Range                       | Yes         |                                   | Request  |
| Security              | Cross-Origin-Opener-Policy          | Yes         |                                   | Response |
| Security              | Cross-Origin-Resource-Policy        | Yes         |                                   | Response |
| Security              | Content-Security-Policy             | Yes         |                                   | Response |
| Security              | Content-Security-Policy-Report-Only | Yes         |                                   | Response |
| Security              | Expect-CT                           | Yes         |                                   | Response |
| Security              | Feature-Policy                      | Yes         |                                   | Response |
| Security              | Public-Key-Pins                     | Yes         |                                   | Response |
| Security              | Public-Key-Pins-Report-Only         | Yes         |                                   | Response |
| Security              | Strict-Transport-Security           | Yes         |                                   | Response |
| Security              | Upgrade-Insecure-Requests           | Yes         |                                   | Request  |
| Transfer Encoding     | Transfer-Encoding                   | No          | Memento does not support encoding | Response |
| Transfer Encoding     | TE                                  | No          | Memento does not support encoding | Response |
| Transfer Encoding     | Trailer                             | No          | Memento does not support encoding | Response |
| Other                 | Alt-Svc                             | Yes         |                                   | Response |
| Other                 | Date                                | Yes         |                                   | Response |
| Other                 | Large-Allocation                    | Yes         |                                   | Response |
| Other                 | Link                                | Yes         |                                   | Response |
| Other                 | Retry-After                         | Yes         |                                   | Response |
| Other                 | Server-Timing                       | Yes         |                                   | Response |
| Other                 | SourceMap                           | Yes         |                                   | Response |
| Other                 | Upgrade                             | No          |                                   | Response |