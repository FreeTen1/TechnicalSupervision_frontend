import React from "react"
import ProxyPass from "./ProsyPass"

async function queryAPI_get(query) {
    let res = await fetch(`${ProxyPass}/${query}`, {
        method: "GET",
    })
    return await res
}

export default queryAPI_get
