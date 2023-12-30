import hackerNewsAPI from '@/api/hackerNewsAPI';

/// Params*
/// commentIds: array
/// 
export const useGetChildComments = async (commentsIds: Array<Number>[]) => {
    if(!commentsIds) return [];

    const commentsReceived = [];

    for (let index = 0; index < commentsIds.length; index++) {
        const resp = await hackerNewsAPI.getHackerNewsItem(commentsIds[index]);

        if(resp.status != 200) {
            continue;
        }

        commentsReceived.push(resp.data);
    }

    return commentsReceived;
}