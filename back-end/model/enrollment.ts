import { Enrollment as EnrollmentPrisma, Subscription as SubscriptionPrisma, Region as RegionPrisma, Club as ClubPrisma, Member as MemberPrisma, Person as PersonPrisma } from '@prisma/client';

import { Club } from "./club";
import { Member } from "./member";
import { Region } from "./region";
import { Subscription } from "./subscription";
import { fromUnixTime } from 'date-fns';

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
        club: Club | null,
        region: Region | null,
    }) {
        this.id = Enrollment.id;
        this.subscription = Enrollment.subscription;
        this.member = Enrollment.member;
        this.club = Enrollment.club;
        this.region = Enrollment.region;
    }

    // equals
    equals({id, subscription, member, club, region}: Enrollment): boolean {
        return (
            this.id === id &&
            this.subscription.equals(subscription) &&
            this.member.equals(member)
        )
    }

    static from({
        id,
        subscription,
        member,
        club,
        region
    }: EnrollmentPrisma & {
        subscription: SubscriptionPrisma,
        member: (MemberPrisma & {person: PersonPrisma}),
        club: ClubPrisma,
        region: (RegionPrisma & {clubs: ClubPrisma[]}),
    }) {
        return new Enrollment({
            id: id,
            subscription: Subscription.from(subscription),
            member: Member.from(member),
            club: club ? Club.from(club) : null,
            region: region ? Region.from(region) : null,
        });
    }

    // toString
    public toString(): string {
        return `Enrollment [id=${this.id}, subscription=${this.subscription}, member=${this.member}, club=${this.club}, region=${this.region}]`;
    }

}