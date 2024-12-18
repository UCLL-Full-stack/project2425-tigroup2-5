import { Club } from "./club";
import { Member } from "./member";
import { Region } from "./region";
import { Subscription } from "./subscription";

export class Enrollment {
    readonly id?: number;
    readonly subscription: Subscription;
    readonly member: Member;
    readonly club?: Club | null;
    readonly region?: Region | null;

    // constructor
    constructor(Enrollment: {
        id: number,
        subscription: Subscription,
        member: Member,
        club: Club,
        region: Region
    }) {
        this.id = Enrollment.id;
        this.subscription = Enrollment.subscription;
        this.member = Enrollment.member;
        this.club = Enrollment.club;
        this.region = Enrollment.region;
        Enrollment.subscription.enrollments.push(this);
        Enrollment.member.enrollments.push(this);
        if (Enrollment.club) {
            Enrollment.club.enrollments.push(this);
        }
        if (Enrollment.region) {
            Enrollment.region.enrollments.push(this);
        }
    }

    // equals
    equals({id, subscription, member, club, region}: Enrollment): boolean {
        return (
            this.id === id &&
            this.subscription.equals(subscription) &&
            this.member.equals(member)
        )
    }

    // toString
    public toString(): string {
        return `Enrollment [id=${this.id}, subscription=${this.subscription}, member=${this.member}, club=${this.club}, region=${this.region}]`;
    }

}