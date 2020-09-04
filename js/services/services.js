const postData = async (url, data) => { // настроиваем запрос, внутри будет ассихронный код
    const res = await fetch(url, { // фетчим, получаем ответ от сервера
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });

    return await res.json(); // трансофрмируем в json промис
};

const getResource = async (url) => { // просто делаем запрос
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`); // создаем объет ошибки
    }

    return await res.json(); // трансофрмируем в json промис
};

export {postData, getResource};
