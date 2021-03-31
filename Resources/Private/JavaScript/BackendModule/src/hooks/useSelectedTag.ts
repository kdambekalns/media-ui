import { useRecoilValue } from 'recoil';
import { useApolloClient } from '@apollo/client';

import { Tag } from '../interfaces';
import { selectedTagIdState } from '../state';
import { TAG_FRAGMENT } from '../queries';

const useSelectedTag = (): Tag => {
    const client = useApolloClient();
    const selectedTagId = useRecoilValue(selectedTagIdState);

    // Read selection from cache as we can only select tags that have been queried before
    try {
        return client.readFragment(
            {
                id: `Tag_${selectedTagId}`,
                fragment: TAG_FRAGMENT,
                fragmentName: 'TagProps',
            },
            true
        );
    } catch (e) {
        // TODO: Run query to get the tag when its not found
        console.error(e, 'Selected tag missing in cache');
    }

    return null;
};

export default useSelectedTag;
