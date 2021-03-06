import React from 'react';
import { Divider, Heading, Flex, Image, Text } from '@chakra-ui/react';
import { State } from './reducer';
import { ipfsCidFromUri } from '../../util';

export default function Preview({ state }: { state: State }) {
  const { name, description } = state.fields;
  return (
    <Flex
      flexDir="column"
      maxW="530px"
      bg="white"
      borderWidth="1px"
      borderColor="brand.lightBlue"
      borderRadius="2px"
      boxShadow="0px 0px 0px 4px rgba(211, 222, 245, 0.3)"
    >
      <Flex
        width="100"
        justify="center"
        align="center"
        height="300px"
        overflow="hidden"
      >
        <Image
          src={state.artifactUri || ''}
          overflow="hidden"
          objectFit="contain"
          objectPosition="center"
        />
      </Flex>
      <Heading size="md" color={name ? 'black' : 'gray.200'} px={8} py={6}>
        {name ? name : 'Asset name...'}
      </Heading>
      <Divider borderColor="brand.lightBlue" opacity="1" />
      <Text
        px={8}
        py={6}
        color={description ? 'black' : 'gray.200'}
        fontFamily="mono"
      >
        {description ? description : 'Asset description...'}
      </Text>
      <Divider borderColor="brand.lightBlue" opacity="1" />
      <Flex flexDir="column" px={8} py={6}>
        <Text pb={2} fontSize="xs" color="brand.gray" textTransform="uppercase">
          IPFS Hash
        </Text>
        <Text>
          {(state.artifactUri && ipfsCidFromUri(state.artifactUri)) || ''}
        </Text>
      </Flex>
    </Flex>
  );
}
