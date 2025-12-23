const axios = require("axios");
module.exports = async () => {
    const { data, errors } = await axios({
        url: `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/nrwib-redirects/v1/redirects`,
        method: 'get',
    })
    if (errors) {
        throw JSON.stringify(errors);
    }
    return data;
}
