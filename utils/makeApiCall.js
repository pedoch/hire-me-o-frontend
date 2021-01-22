import axios from "axios";

async function makeApiCall({ url, config }) {
  try {
    const { data } = await axios({
      url: `https://hire-me-o.herokuapp.com/api${url}`,
      ...config,
    });

    return {
      data: data,
      message: data.message,
    };
  } catch (error) {
    throw error;
  }
}

export default makeApiCall;
