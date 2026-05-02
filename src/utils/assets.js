const CDN = 'https://gport.s3.eu-central-1.amazonaws.com/dreampick-tv';

export function img(path) {
  return `${CDN}/images/${path}`;
}
