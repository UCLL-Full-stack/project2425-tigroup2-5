import ClubOverview from "@/app/components/clubs/clubOverview";
import Header from "@/app/components/header";

export default function Clubs() { 
    return (
        <>
        <Header></Header>
        <ClubOverview clubs={[]}></ClubOverview>
    </>
    )
}