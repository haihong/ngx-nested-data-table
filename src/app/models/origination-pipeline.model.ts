export class OriginationPipelineDetail {
    name: string;
    receivedAmount: number;
    receivedCount: number;
    processedAmount: number;
    processedCount: number;
    indicativeAmount: number;
    indicativeCount: number;
    valReqAmount: number;
    valuationRequestedCount: number;
    valRecAmount: number;
    valuationReceivedCount: number;
    recommendAmount: number;
    applicationRecommendedCount: number;
    approvedAmount: number;
    creditApprovedCount: number;
    totalAmount: number;
    totalCount: number;
}


export class OriginationPipeline {
    name: string;
    receivedAmount: number;
    receivedCount: number;
    processedAmount: number;
    processedCount: number;
    indicativeAmount: number;
    indicativeCount: number;
    valReqAmount: number;
    valuationRequestedCount: number;
    valRecAmount: number;
    valuationReceivedCount: number;
    recommendAmount: number;
    applicationRecommendedCount: number;
    approvedAmount: number;
    creditApprovedCount: number;
    totalAmount: number;
    totalCount: number;
    details: OriginationPipelineDetail[];
}
