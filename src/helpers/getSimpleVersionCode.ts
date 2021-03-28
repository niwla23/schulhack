export const getSimpleVersionCode = (longCode: number, abi: string): Number => {
    const abi_to_num = {
        "armeabi-v7a": 1,
        "x86": 2,
        "arm64-v8a": 3,
        "x86_64": 4
    }
    return longCode - abi_to_num[abi] * 1048576
}

export default getSimpleVersionCode