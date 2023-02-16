const errorMessagesObject = {
  GET: 'An error appeared while fetching data. Please reload the page. If the issue persists please contact us.',
  PATCH:
    'An error appeared while updating a record. Please, start over. If the issue persists please contact us.',
  POST: 'An error appeared while creating a new record. Please, start over. If the issue persists please contact us.',
  DELETE:
    'An error appeared while deleting a record. Please, try again. If the issue persists please contact us.',
  DELETE_MANY:
    'An error appeared while deleting multiple records. Please, try again. If the issue persists please contact us.'
};

export default function extractError(theUrl, method, statusCode) {
  let url, content, isAuthorized;

  if (theUrl && method === 'GET' && theUrl.includes('?')) {
    url = theUrl.split('?')[0];
  } else {
    url = theUrl;
  }

  if (statusCode !== 401) {
    for (const key in errorMessagesObject) {
      content = errorMessagesObject[method];
      isAuthorized = true;
      break;
    }

    if (!content) {
      content = errorMessagesObject.default;
      isAuthorized = true;
    }
  } else {
    content = errorMessagesObject.unauthorized;
    isAuthorized = false;
  }

  return {
    content,
    isAuthorized
  };
}
