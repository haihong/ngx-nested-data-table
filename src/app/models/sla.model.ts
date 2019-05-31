export class SlaDetail {
    name: string;
    processedOne:   number;
    processedTwo:   number;
    processedThree: number;
    processedFour:  number;

    sentOne:        number;
    sentTwo:        number;
    sentThree:      number;
    sentFour:       number;

    recommendOne:   number;
    recommendTwo:   number;
    recommendThree: number;
    recommendFour:  number;

    approvalOne:   number;
    approvalTwo:   number;
    approvalThree: number;
    approvalFour:  number;

}

export class Sla {
    name: string;
    processedOne:   number;
    processedTwo:   number;
    processedThree: number;
    processedFour:  number;

    sentOne:        number;
    sentTwo:        number;
    sentThree:      number;
    sentFour:       number;

    recommendOne:   number;
    recommendTwo:   number;
    recommendThree: number;
    recommendFour:  number;

    approvalOne:   number;
    approvalTwo:   number;
    approvalThree: number;
    approvalFour:  number;

    details: SlaDetail[];
}
