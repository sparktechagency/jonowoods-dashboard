export const getBaseUrl = (production) => {
    return production ? 'https://api.yogawithjen.life' : "http://10.10.7.62:7000";
}

export const getConfigUrl = (production) => {
    return production ? '69.62.67.86' : "10.10.7.62";
}