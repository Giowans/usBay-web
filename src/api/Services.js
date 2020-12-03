const base64 = require('base-64');
// test api 
const urlBase="http://35.161.141.219/api";
// Produccion
// const urlBase = "url api produccion aqui mero";
//bucket images
export  var uploadUrl=`${urlBase}locailizacion del bucket de imagenes`
export var tokenConekta={};
var tokenId = "";

export function setToken(token){
    tokenId = token ;
}

export async function login(params,model){
    let username = 'ps_secureu';
    let password = 'fGx4=yU-j4^jAAjZtV+YTDsm-@R$HAK3';
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));
    
    // var data = new URLSearchParams();
    // data.append('username', params.username);
    // data.append('password', params.password);
    // data.append('grant_type', params.grant_type);

    let details = {
        'username': params.username,
        'password': params.password,
        'grant_type': params.grant_type
    };

    let formBody = [];
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    let getAct = await fetch(urlBase+`/${model}/access_token`,{
        method:"POST",
        body: formBody,
        headers: headers,
    })
    try{
        let data = await getAct.json()
        return data
    }catch(err){
        return err
    }  
}

export async function post(data,model, access_token){
    let getAct = await fetch(urlBase+`/${model}`,{
        method:"POST",
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
        }
    })
    try{
        let data = await getAct.json()
        return data
    }catch(err){
        return err
    }  
}

export async function getFilterById(id,model){
    let getAct = await fetch(urlBase+`/${model}/${id}`,{
        method:"GET",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json; charset=utf-8'
        },
    })
    let data = await getAct
    if(!data.error && data){
      return data.json()
    }else{
        return false
    }   
}

export async function getFilter(filter,model, count, access_token){
    let params = getFilterParam(filter, count)
    let getAct = await fetch(urlBase+`/${model}${count  ? "/count?where="+params+"&" : "?"}access_token=${access_token}${count ? "" : params}`,{
        method:"GET",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json; charset=utf-8'
        },
    })
    let data = await getAct
    console.log(data)
    if(!data.error && data){
      return data.json()
    }else{
        return false
    }   
}


export async function tokenToServer(data, tokenOne) {

    var token = {
        deviceId: tokenOne.userId,
        token: tokenOne.pushToken,
    }
    tokenConekta=token;
    if (data.notificationTokens) {
        if (data.notificationTokens.length) {
            var index = data.notificationTokens.findIndex((item) => {
                return item.deviceId === tokenOne.userId
            })

            if (index > -1) {
                if (data.notificationTokens[index].token != tokenOne.pushToken) {
                    data.notificationTokens[index] = token
                    let pat = await patch("AppUsers", data.id, { notificationTokens: data.notificationTokens })
                }
            } else {
                data.notificationTokens.push(token)
                let pat = await patch("AppUsers", data.id, { notificationTokens: data.notificationTokens })
            }
        } else {
            let pat = await patch("AppUsers", data.id, { notificationTokens: [token] })
        }
    } else {
        let pat = await patch("AppUsers", data.id, { notificationTokens: [token] })
    }

}

export async function patch ( model, id, formData, tokenId) {
    var getAct
    if(id){
        getAct = await fetch(urlBase +`/${model}/${id}?access_token=${tokenId}` , {
            headers:{
                'Content-Type': 'application/json'
            },
            method: "PATCH",
            body: JSON.stringify( formData )
        })
    }else{
        getAct = await fetch(urlBase +`/${model}?access_token=${tokenId}` , {
            headers:{
                'Content-Type': 'application/json'
            },
            method: "PATCH",
            body: JSON.stringify( formData )
        }) 
    }
    let data = await getAct
    console.log(data)
    if(data){
      return data.json()
    }else{
        return false
    } 
}

export async function functionDelete(model, id) {
    let getAct = await fetch(urlBase +`/${model}/${id}` , {
        headers:{
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
    let data = await getAct
    console.log(data)
    if(data){
        return data.json()
    }else{
        return false
    } 
}

const getFilterParam = (apiNodeObject, count ) => {
    let apiNodeObjectOnJsonFormat = JSON.stringify(apiNodeObject)
    let apiNodeObjectUriEncoded = encodeURI(apiNodeObjectOnJsonFormat)
    if(count){
        return apiNodeObjectUriEncoded
    }else{
        return "&filter=" + apiNodeObjectUriEncoded
    }
    
}
