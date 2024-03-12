/* eslint-disable max-depth */
// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import log from 'loglevel';
const logger = log.getLogger('default');


export const resourceName = process.env.PIPELINE_SECTION_REGISTRATIONS;
export async function fetchSectionRegistrations({ authenticatedEthosFetch, queryKeys, signal }) {
    if (!process.env.PIPELINE_SECTION_REGISTRATIONS) {
        const message = 'PIPELINE_SECTION_REGISTRATIONS is not defined in environment!!!';
        console.error(message);
        throw new Error(message);
    }
    const { cardId, cardPrefix, sectionId = '' } = queryKeys;
    try {
        const start = new Date();

        if (!sectionId) {
            return {
                data: undefined
            }
        }

        const searchParameters = new URLSearchParams({
            cardId,
            cardPrefix,
            sectionId
        }).toString();

        const response = await authenticatedEthosFetch(`${resourceName}?${searchParameters}`, {
            headers: {
                Accept: 'application/json'
            },
            signal
        });
        const data = await response.json();
        const end = new Date();
        logger.debug(`fetch ${resourceName} time: ${end.getTime() - start.getTime()}`);

        if (data?.errors) {
            return {
                dataError: data.errors,
                data: []
            }
        }

        return {
            data
        };
    } catch (error) {
        logger.error('unable to fetch data: ', error);
        throw error;
    }
}