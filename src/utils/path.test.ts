import { Request } from '../domain/entity';
import {
  getProjectDirectory,
  getRequestDirectory,
  getFileExtension,
} from './path';

describe('getProjectDirectory', () => {
  it('should return the project directory', () => {
    // Given
    const cacheDirectory = '/tmp/.memento-cache';
    const targetUrl = 'https://pokeapi.co/api/v2';

    // When
    const projectDirectory = getProjectDirectory(cacheDirectory, targetUrl);

    //Then
    expect(projectDirectory).toEqual(
      '/tmp/.memento-cache/https___pokeapi-co_api_v2'
    );
  });
});

describe('getRequestDirectory', () => {
  it('should return the request directory', () => {
    // Given
    const cacheDirectory = '/tmp/.memento-cache';
    const targetUrl = 'https://pokeapi.co/api/v2';
    const request = new Request(
      'GET',
      '/really_long_url?with=some&query=parameters[get__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_url]',
      {},
      ''
    );

    // When
    const requestDirectory = getRequestDirectory(
      cacheDirectory,
      targetUrl,
      request
    );

    //Then
    expect(requestDirectory).toEqual(
      '/tmp/.memento-cache/https___pokeapi-co_api_v2/25276a6270cf8ba1277f7004a92dece9687f82e1'
    );
  });
});

describe('getFileExtension', () => {
  it.each([
    ['application/json', '.json'],
    ['application/json; charset=utf-8', '.json'],
    ['application/xml', '.xml'],
    ['application/xml; charset=utf-8', '.xml'],
    ['application/envoy', '.evy'],
    ['application/fractals', '.fif'],
    ['application/futuresplash', '.spl'],
    ['application/hta', '.hta'],
    ['application/internet-property-stream', '.acx'],
    ['application/mac-binhex40', '.hqx'],
    ['application/msword', '.doc'],
    ['application/octet-stream', ''],
    ['application/oda', '.oda'],
    ['application/olescript', '.axs'],
    ['application/pdf', '.pdf'],
    ['application/pics-rules', '.prf'],
    ['application/pkcs10', '.p10'],
    ['application/pkix-crl', '.crl'],
    ['application/postscript', '.eps'],
    ['application/rtf', '.rtf'],
    ['application/xml', '.xml'],
    ['application/set-payment-initiation', '.setpay'],
    ['application/set-registration-initiation', '.setreg'],
    ['application/vnd.ms-excel', '.xls'],
    ['application/vnd.ms-outlook', '.msg'],
    ['application/vnd.ms-pkicertstore', '.sst'],
    ['application/vnd.ms-pkiseccat', '.cat'],
    ['application/vnd.ms-pkistl', '.stl'],
    ['application/vnd.ms-powerpoint', '.ppt'],
    ['application/vnd.ms-project', '.mpp'],
    ['application/vnd.ms-works', '.wks'],
    ['application/winhlp', '.hlp'],
    ['application/x-bcpio', '.bcpio'],
    ['application/x-cdf', '.cdf'],
    ['application/x-compress', '.z'],
    ['application/x-compressed', '.tgz'],
    ['application/x-cpio', '.cpio'],
    ['application/x-csh', '.csh'],
    ['application/x-director', '.dcr'],
    ['application/x-dvi', '.dvi'],
    ['application/x-gtar', '.gtar'],
    ['application/x-gzip', '.gz'],
    ['application/x-hdf', '.hdf'],
    ['application/x-internet-signup', '.ins'],
    ['application/x-iphone', '.iii'],
    ['application/x-javascript', '.js'],
    ['application/x-latex', '.latex'],
    ['application/x-msaccess', '.mdb'],
    ['application/x-mscardfile', '.crd'],
    ['application/x-msclip', '.clp'],
    ['application/x-msdownload', '.dll'],
    ['application/x-msmediaview', '.m13'],
    ['application/x-msmetafile', '.wmf'],
    ['application/x-msmoney', '.mny'],
    ['application/x-mspublisher', '.pub'],
    ['application/x-msschedule', '.scd'],
    ['application/x-msterminal', '.trm'],
    ['application/x-mswrite', '.wri'],
    ['application/x-netcdf', '.cdf'],
    ['application/x-perfmon', '.pma'],
    ['application/x-pkcs12', '.p12'],
    ['application/x-pkcs7-certificates', '.p7b'],
    ['application/x-pkcs7-certreqresp', '.p7r'],
    ['application/x-pkcs7-mime', '.p7c'],
    ['application/x-pkcs7-signature', '.p7s'],
    ['application/x-sh', '.sh'],
    ['application/x-shar', '.shar'],
    ['application/x-shockwave-flash', '.swf'],
    ['application/x-stuffit', '.sit'],
    ['application/x-sv4cpio', '.sv4cpio'],
    ['application/x-sv4crc', '.sv4crc'],
    ['application/x-tar', '.tar'],
    ['application/x-tcl', '.tcl'],
    ['application/x-tex', '.tex'],
    ['application/x-texinfo', '.texi'],
    ['application/x-troff', '.roff'],
    ['application/x-troff-man', '.man'],
    ['application/x-troff-me', '.me'],
    ['application/x-troff-ms', '.ms'],
    ['application/x-ustar', '.ustar'],
    ['application/x-wais-source', '.src'],
    ['application/x-x509-ca-cert', '.cer'],
    ['application/ynd.ms-pkipko', '.pko'],
    ['application/zip', '.zip'],
    ['audio/basic', '.au'],
    ['audio/mid', '.mid'],
    ['audio/mpeg', '.mp3'],
    ['audio/x-aiff', '.aif'],
    ['audio/x-mpegurl', '.m3u'],
    ['audio/x-pn-realaudio', '.ra'],
    ['audio/x-wav', '.wav'],
    ['image/bmp', '.bmp'],
    ['image/cis-cod', '.cod'],
    ['image/gif', '.gif'],
    ['image/ief', '.ief'],
    ['image/jpeg', '.jpg'],
    ['image/pipeg', '.jfif'],
    ['image/svg+xml', '.svg'],
    ['image/tiff', '.tiff'],
    ['image/x-cmu-raster', '.ras'],
    ['image/x-cmx', '.cmx'],
    ['image/x-icon', '.ico'],
    ['image/x-portable-anymap', '.pnm'],
    ['image/x-portable-bitmap', '.pbm'],
    ['image/x-portable-graymap', '.pgm'],
    ['image/x-portable-pixmap', '.ppm'],
    ['image/x-rgb', '.rgb'],
    ['image/x-xbitmap', '.xbm'],
    ['image/x-xpixmap', '.xpm'],
    ['image/x-xwindowdump', '.xwd'],
    ['message/rfc822', '.mhtml'],
    ['text/css', '.css'],
    ['text/h323', '.323'],
    ['text/html', '.html'],
    ['text/iuls', '.uls'],
    ['text/plain', '.txt'],
    ['text/xml', '.xml'],
    ['text/richtext', '.rtx'],
    ['text/scriptlet', '.sct'],
    ['text/tab-separated-values', '.tsv'],
    ['text/webviewhtml', '.htt'],
    ['text/x-component', '.htc'],
    ['text/x-setext', '.etx'],
    ['text/x-vcard', '.vcf'],
    ['video/mpeg', '.mpeg'],
    ['video/mp4', '.mp4'],
    ['video/quicktime', '.mov'],
    ['video/x-la-asf', '.lsf'],
    ['video/x-ms-asf', '.asf'],
    ['video/x-msvideo', '.avi'],
    ['video/x-sgi-movie', '.movie'],
    ['x-world/x-vrml', '.vrml'],
    ['invalid;type;;', ''],
    ['', ''],
  ])('%s returns %s', (contentType: string, expectedExtension: string) => {
    expect(getFileExtension(contentType)).toEqual(expectedExtension);
  });
});
