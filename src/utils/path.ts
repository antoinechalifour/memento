import path from 'path';
import { parse as parseContentType } from 'content-type';

import { Request } from '../domain/entity';

export function getProjectDirectory(cacheDirectory: string, targetUrl: string) {
  const projectDir = targetUrl.replace(/[:\/]/g, '_').replace(/\./g, '-');

  return path.join(cacheDirectory, projectDir);
}

export function getRequestDirectory(
  cacheDirectory: string,
  targetUrl: string,
  request: Request
) {
  const projectDirectoryPath = getProjectDirectory(cacheDirectory, targetUrl);

  return path.join(projectDirectoryPath, request.id);
}

const extensionsMap = new Map<string, string>();

extensionsMap.set('application/envoy', 'evy');
extensionsMap.set('application/fractals', 'fif');
extensionsMap.set('application/futuresplash', 'spl');
extensionsMap.set('application/hta', 'hta');
extensionsMap.set('application/internet-property-stream', 'acx');
extensionsMap.set('application/mac-binhex40', 'hqx');
extensionsMap.set('application/msword', 'doc');
extensionsMap.set('application/oda', 'oda');
extensionsMap.set('application/olescript', 'axs');
extensionsMap.set('application/pdf', 'pdf');
extensionsMap.set('application/pics-rules', 'prf');
extensionsMap.set('application/pkcs10', 'p10');
extensionsMap.set('application/pkix-crl', 'crl');
extensionsMap.set('application/postscript', 'eps');
extensionsMap.set('application/json', 'json');
extensionsMap.set('application/xml', 'xml');
extensionsMap.set('application/rtf', 'rtf');
extensionsMap.set('application/set-payment-initiation', 'setpay');
extensionsMap.set('application/set-registration-initiation', 'setreg');
extensionsMap.set('application/vnd.ms-excel', 'xls');
extensionsMap.set('application/vnd.ms-outlook', 'msg');
extensionsMap.set('application/vnd.ms-pkicertstore', 'sst');
extensionsMap.set('application/vnd.ms-pkiseccat', 'cat');
extensionsMap.set('application/vnd.ms-pkistl', 'stl');
extensionsMap.set('application/vnd.ms-powerpoint', 'ppt');
extensionsMap.set('application/vnd.ms-project', 'mpp');
extensionsMap.set('application/vnd.ms-works', 'wks');
extensionsMap.set('application/winhlp', 'hlp');
extensionsMap.set('application/x-bcpio', 'bcpio');
extensionsMap.set('application/x-cdf', 'cdf');
extensionsMap.set('application/x-compress', 'z');
extensionsMap.set('application/x-compressed', 'tgz');
extensionsMap.set('application/x-cpio', 'cpio');
extensionsMap.set('application/x-csh', 'csh');
extensionsMap.set('application/x-director', 'dcr');
extensionsMap.set('application/x-dvi', 'dvi');
extensionsMap.set('application/x-gtar', 'gtar');
extensionsMap.set('application/x-gzip', 'gz');
extensionsMap.set('application/x-hdf', 'hdf');
extensionsMap.set('application/x-internet-signup', 'ins');
extensionsMap.set('application/x-iphone', 'iii');
extensionsMap.set('application/x-javascript', 'js');
extensionsMap.set('application/x-latex', 'latex');
extensionsMap.set('application/x-msaccess', 'mdb');
extensionsMap.set('application/x-mscardfile', 'crd');
extensionsMap.set('application/x-msclip', 'clp');
extensionsMap.set('application/x-msdownload', 'dll');
extensionsMap.set('application/x-msmediaview', 'm13');
extensionsMap.set('application/x-msmetafile', 'wmf');
extensionsMap.set('application/x-msmoney', 'mny');
extensionsMap.set('application/x-mspublisher', 'pub');
extensionsMap.set('application/x-msschedule', 'scd');
extensionsMap.set('application/x-msterminal', 'trm');
extensionsMap.set('application/x-mswrite', 'wri');
extensionsMap.set('application/x-netcdf', 'cdf');
extensionsMap.set('application/x-perfmon', 'pma');
extensionsMap.set('application/x-pkcs12', 'p12');
extensionsMap.set('application/x-pkcs7-certificates', 'p7b');
extensionsMap.set('application/x-pkcs7-certreqresp', 'p7r');
extensionsMap.set('application/x-pkcs7-mime', 'p7c');
extensionsMap.set('application/x-pkcs7-signature', 'p7s');
extensionsMap.set('application/x-sh', 'sh');
extensionsMap.set('application/x-shar', 'shar');
extensionsMap.set('application/x-shockwave-flash', 'swf');
extensionsMap.set('application/x-stuffit', 'sit');
extensionsMap.set('application/x-sv4cpio', 'sv4cpio');
extensionsMap.set('application/x-sv4crc', 'sv4crc');
extensionsMap.set('application/x-tar', 'tar');
extensionsMap.set('application/x-tcl', 'tcl');
extensionsMap.set('application/x-tex', 'tex');
extensionsMap.set('application/x-texinfo', 'texi');
extensionsMap.set('application/x-troff', 'roff');
extensionsMap.set('application/x-troff-man', 'man');
extensionsMap.set('application/x-troff-me', 'me');
extensionsMap.set('application/x-troff-ms', 'ms');
extensionsMap.set('application/x-ustar', 'ustar');
extensionsMap.set('application/x-wais-source', 'src');
extensionsMap.set('application/x-x509-ca-cert', 'cer');
extensionsMap.set('application/ynd.ms-pkipko', 'pko');
extensionsMap.set('application/zip', 'zip');
extensionsMap.set('audio/basic', 'au');
extensionsMap.set('audio/mid', 'mid');
extensionsMap.set('audio/mpeg', 'mp3');
extensionsMap.set('audio/x-aiff', 'aif');
extensionsMap.set('audio/x-mpegurl', 'm3u');
extensionsMap.set('audio/x-pn-realaudio', 'ra');
extensionsMap.set('audio/x-wav', 'wav');
extensionsMap.set('image/bmp', 'bmp');
extensionsMap.set('image/cis-cod', 'cod');
extensionsMap.set('image/gif', 'gif');
extensionsMap.set('image/ief', 'ief');
extensionsMap.set('image/jpeg', 'jpg');
extensionsMap.set('image/pipeg', 'jfif');
extensionsMap.set('image/svg+xml', 'svg');
extensionsMap.set('image/tiff', 'tiff');
extensionsMap.set('image/x-cmu-raster', 'ras');
extensionsMap.set('image/x-cmx', 'cmx');
extensionsMap.set('image/x-icon', 'ico');
extensionsMap.set('image/x-portable-anymap', 'pnm');
extensionsMap.set('image/x-portable-bitmap', 'pbm');
extensionsMap.set('image/x-portable-graymap', 'pgm');
extensionsMap.set('image/x-portable-pixmap', 'ppm');
extensionsMap.set('image/x-rgb', 'rgb');
extensionsMap.set('image/x-xbitmap', 'xbm');
extensionsMap.set('image/x-xpixmap', 'xpm');
extensionsMap.set('image/x-xwindowdump', 'xwd');
extensionsMap.set('message/rfc822', 'mhtml');
extensionsMap.set('text/css', 'css');
extensionsMap.set('text/h323', '323');
extensionsMap.set('text/html', 'html');
extensionsMap.set('text/xml', 'xml');
extensionsMap.set('text/iuls', 'uls');
extensionsMap.set('text/plain', 'txt');
extensionsMap.set('text/richtext', 'rtx');
extensionsMap.set('text/scriptlet', 'sct');
extensionsMap.set('text/tab-separated-values', 'tsv');
extensionsMap.set('text/webviewhtml', 'htt');
extensionsMap.set('text/x-component', 'htc');
extensionsMap.set('text/x-setext', 'etx');
extensionsMap.set('text/x-vcard', 'vcf');
extensionsMap.set('video/mpeg', 'mpeg');
extensionsMap.set('video/mp4', 'mp4');
extensionsMap.set('video/quicktime', 'mov');
extensionsMap.set('video/x-la-asf', 'lsf');
extensionsMap.set('video/x-ms-asf', 'asf');
extensionsMap.set('video/x-msvideo', 'avi');
extensionsMap.set('video/x-sgi-movie', 'movie');
extensionsMap.set('x-world/x-vrml', 'vrml');

const DEFAULT_EXTENSION = '';

export function getFileExtension(rawContentType: string = '') {
  try {
    const parsedContentType = parseContentType(rawContentType);

    for (const [contentType, extension] of extensionsMap.entries()) {
      if (parsedContentType.type === contentType) {
        return `.${extension}`;
      }
    }

    return DEFAULT_EXTENSION;
  } catch (err) {
    return DEFAULT_EXTENSION;
  }
}
