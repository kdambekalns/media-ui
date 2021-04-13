import cloneDeep from 'lodash.clonedeep';

import { AssetUsage } from '@media-ui/feature-asset-usage/src';
import { Asset, AssetCollection, AssetSource, Image, IptcProperty, Tag } from '@media-ui/core/src/interfaces';

const exampleImages = ['example1.jpg', 'example2.jpg', 'example3.jpg'];

const range = (length: number) => [...Array(length)].map((val, i) => i);
const getExampleFilename = (seed = 0) => exampleImages[seed % exampleImages.length];
const getExampleImagePath = (filename) => `Assets/${filename}`;

const getIptcProperties = (seed: number): IptcProperty[] => [
    {
        __typename: 'IptcProperty',
        propertyName: 'Camera',
        value: `Phone ${seed}`,
    },
    {
        __typename: 'IptcProperty',
        propertyName: 'Exposure',
        value: `${seed}`,
    },
    {
        __typename: 'IptcProperty',
        propertyName: 'SpecialSetting',
        value: `${seed % 2 === 0 ? 'true' : 'false'}`,
    },
];

const typeIcons: { [key: string]: Image } = {
    jpg: {
        __typename: 'Image',
        width: 16,
        height: 16,
        url: 'jpg.svg',
        alt: 'jpeg image',
    },
};

const assetSources: AssetSource[] = [
    {
        __typename: 'AssetSource',
        id: 'neos',
        label: 'Neos',
        description: 'The Neos core asset source',
        iconUri: 'asset-source-icon.svg',
        readOnly: false,
        supportsTagging: true,
        supportsCollections: true,
    },
    {
        __typename: 'AssetSource',
        id: 'example-cloud-source',
        label: 'Example ☁️ Source',
        description: 'The source directly from the ☁️',
        iconUri: 'asset-source-icon.svg',
        readOnly: true,
        supportsTagging: false,
        supportsCollections: false,
    },
];

const tags: Tag[] = range(10).map((index) => ({
    __typename: 'Tag',
    id: `index ${index + 1}`,
    label: `Example tag ${index + 1}`,
    parent: null,
    children: [],
}));

const assetCollections: AssetCollection[] = range(3).map((index) => ({
    __typename: 'AssetCollection',
    id: `someId_${index}`,
    title: `Example collection ${index + 1}`,
    tags: range(index % 3).map((i) => tags[(i * 3 + index) % tags.length]),
}));

const assets: Asset[] = range(150).map((index) => {
    const isCloud = index > 120;
    const filename = getExampleFilename(index);

    return {
        __typename: 'Asset',
        id: index.toString(),
        localId: index.toString(),
        assetSource: assetSources[isCloud ? 1 : 0],
        imported: isCloud && index % 3 === 0,
        label: `Example asset ${index + 1}`,
        caption: `The caption for example asset ${index + 1}`,
        filename: 'example1.jpg',
        tags: range(index % 3).map((i) => tags[(i * 3 + index) % tags.length]),
        collections: range(index % 2).map((i) => assetCollections[(i * 2 + index) % assetCollections.length]),
        copyrightNotice: 'The Neos team',
        lastModified: new Date('2020-06-16 15:07:00'),
        iptcProperties: index % 5 === 0 ? getIptcProperties(index) : [],
        width: 90,
        height: 210,
        file: {
            __typename: 'AssetFile',
            extension: 'jpg',
            mediaType: 'image/jpeg',
            typeIcon: typeIcons.jpg,
            size: 200,
            url: getExampleImagePath(filename),
        },
        thumbnailUrl: getExampleImagePath(filename),
        previewUrl: getExampleImagePath(filename),
    };
});

// TODO: Make this more variable
const assetUsageReferences: AssetUsage[] = range(150)
    .map((index) => {
        return {
            __typename: 'AssetUsage',
            assetId: ((index * 4) % assets.length).toString(),
            serviceId: 'neos',
            label: `Usage ${index} in node xyz`,
            metadata: {
                backendUri: 'http://localhost/neos/somewhere-in-the-content-module',
            },
        };
    })
    .filter((usage) => !!usage);

const loadFixtures = () => {
    return {
        assets: cloneDeep(assets) as Asset[],
        assetCollections: cloneDeep(assetCollections) as AssetCollection[],
        assetSources: cloneDeep(assetSources) as AssetSource[],
        assetUsageReferences: cloneDeep(assetUsageReferences) as AssetUsage[],
        tags: cloneDeep(tags) as Tag[],
    };
};

export { loadFixtures };
