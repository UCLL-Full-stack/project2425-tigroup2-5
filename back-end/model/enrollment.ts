import { Club } from "./club";
import { Member } from "./member";
import { Region } from "./region";
import { Subscription } from "./subscription";

export class Enrollment {
    private id!: number;
    private subscription!: Subscription;
    private member!: Member;
    private club?: Club;
    private region?: Region;

    // constructor
    constructor(id: number, subscription: Subscription, member: Member, club: Club, region: Region) {
        this.setId(id);
        this.setSubscription(subscription);
        this.setMember(member);
        this.setClub(club);
        this.setRegion(region);
    }

    // getters
    public getId(): number {
        return this.id;
    }

    public getSubscription(): Subscription {
        return this.subscription;
    }

    public getMember(): Member {
        return this.member;
    }

    public getClub(): Club | undefined {
        return this.club;
    }

    public getRegion(): Region | undefined {
        return this.region;
    }

    // setters
    public setId(id: number): void {
        this.id = id;
    }

    public setSubscription(subscription: Subscription): void {
        this.subscription = subscription;
    }

    public setMember(member: Member): void {
        this.member = member;
    }

    public setClub(club: Club): void {
        this.club = club;
    }

    public setRegion(region: Region): void {
        this.region = region;
    }

    // toString
    public toString(): string {
        return `Enrollment [id=${this.id}, subscription=${this.subscription}, member=${this.member}, club=${this.club}, region=${this.region}]`;
    }

}