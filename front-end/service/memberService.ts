import { LoginDTO, Member } from "../types";

const getAllMembers = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/member", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const loginMember = ({email, password}: LoginDTO) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/member/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
};

const memberService = {
    getAllMembers,
    loginMember,
};

export default memberService;