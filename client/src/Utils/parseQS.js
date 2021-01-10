const parseQS = (url, params) => {
  return new URL(url).searchParams.get(params)
}

export default parseQS;

