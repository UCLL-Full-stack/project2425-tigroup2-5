// //import { StatusMessage } from "@/../types";
// import classNames from "classnames";
// import { useRouter } from "next/router";
// import React, { useState } from "react";
// import memberService from "@/../service/memberService";
// import { useTranslation } from "react-i18next";
// import { StatusMessage } from "@/../types";

// const LoginForm: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [emailError, setEmailError] = useState<string | null>(null);
//   const [passwordError, setPasswordError] = useState<string | null>(null);
//   const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
//   //const router = useRouter();
//   const { t } = useTranslation();

//   const clearErrors = () => {
//     setEmailError(null);
//     setPasswordError(null);
//     setStatusMessages([]);
//   };

//   const validate = (): boolean => {
//     let result = true;

//     if (!email && email.trim() === "") {
//       setEmailError(t("login.validate.name"));
//       result = false;
//     }

//     if (!password && password.trim() === "") {
//       setPasswordError(t("login.validate.password"));
//       result = false;
//     }

//     return result;
//   };

//   const handleSubmit = async (event: { preventDefault: () => void; }) => {
//     event.preventDefault();

//     clearErrors();

//     if (!validate()) {
//       return;
//     }

//     const member = { email, password };

//     //const response = await memberService.loginMember(member);

//     if (response.status === 200) {
//       const { token, fullname, username, role } = await response.json();
      
//       localStorage.setItem(
//         "loggedInUser",
//         JSON.stringify({ token, fullname, username, role })
//       );

//       setStatusMessages([
//         {
//           message: t(`login.success`),
//           type: "success",
//         },
//       ]);

//       setTimeout(() => {
//         //router.push("/");
//       }, 2000);
//     } else {
//       setStatusMessages([
//         {
//           message: t("general.error"),
//           type: "error",
//         },
//       ]);
//     }
//   };

//   return (
//     <>
//       <h3 className="px-0">{t("login.title")}</h3>
//       {statusMessages && (
//         <div className="row">
//           <ul className="list-none mb-3 mx-auto ">
//             {statusMessages.map(({ message, type }, index) => (
//               <li
//                 key={index}
//                 className={classNames({
//                   "text-red-800": type === "error",
//                   "text-green-800": type === "success",
//                 })}
//               >
//                 {message}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="emailInput" className="block mb-2 text-sm font-medium">
//           {t("login.label.email")}
//         </label>
//         <div className="block mb-2 text-sm font-medium">
//           <input
//             id="emailInput"
//             type="text"
//             value={email}
//             onChange={(event) => setEmail(event.target.value)}
//             className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
//           />
//           {emailError && <div className="text-red-800 ">{emailError}</div>}
//         </div>
//         <div className="mt-2">
//           <div>
//             <label
//               htmlFor="passwordInput"
//               className="block mb-2 text-sm font-medium"
//             >
//               {t("login.label.password")}
//             </label>
//           </div>
//           <div className="block mb-2 text-sm font-medium">
//             <input
//               id="passwordInput"
//               type="password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
//             />
//             {passwordError && (
//               <div className=" text-red-800">{passwordError}</div>
//             )}
//           </div>
//         </div>
//         <button
//           className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//           type="submit"
//         >
//           {t("login.button")}
//         </button>
//       </form>
//     </>
//   );
// };

// export default LoginForm;
