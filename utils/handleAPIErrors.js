import { toaster } from 'evergreen-ui';

function handleError(defaultMessage, error) {
  console.error(error);
  if (!error.response) {
    toaster.danger(defaultMessage, {
      description: 'Maybe a network error',
    });
  } else if (error.response.status === 500) {
    toaster.danger(defaultMessage, {
      description: 'Must be a problem on our side',
    });
  } else if (error.response.data.message) {
    toaster.danger(defaultMessage, {
      description: error.response.data.message,
    });
  } else if (!error.response.data.errors) {
    toaster.danger(defaultMessage, {
      description: 'Must be a problem on our side',
    });
  } else {
    // console.log(error.response);
    toaster.danger(defaultMessage, {
      description: error.response.data.errors[0].msg,
    });
  }
}

export default handleError;
