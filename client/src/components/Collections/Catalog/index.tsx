import React, { Dispatch, useContext, useEffect } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useLocation } from 'wouter';
import { RefreshCw } from 'react-feather';
import { SystemContext } from '../../../context/system';
import { MinterButton } from '../../common';
import Sidebar from './Sidebar';
import TokenGrid from './TokenGrid';
import { State, Action } from '../reducer';
import {
  getContractNfts,
  getWalletNftAssetContracts
} from '../../../lib/nfts/queries';

interface CatalogProps {
  state: State;
  dispatch: Dispatch<Action>;
}

export default function Catalog({ state, dispatch }: CatalogProps) {
  const [, setLocation] = useLocation();
  const { system } = useContext(SystemContext);

  useEffect(() => {
    const selectedCollection = state.selectedCollection;
    if (selectedCollection === null) {
      dispatch({
        type: 'select_collection',
        payload: { address: state.globalCollection }
      });
    } else {
      getContractNfts(system, selectedCollection).then(tokens => {
        dispatch({
          type: 'populate_collection',
          payload: { address: selectedCollection, tokens }
        });
      });
    }
  }, [state.selectedCollection]);

  useEffect(() => {
    if (system.status !== 'WalletConnected') {
      setLocation('/', { replace: true });
    } else {
      getWalletNftAssetContracts(system).then(collections => {
        dispatch({ type: 'update_collections', payload: { collections } });
      });
    }
  }, [system.status]);

  const selectedCollection = state.selectedCollection;
  if (system.status !== 'WalletConnected' || !selectedCollection) {
    return null;
  }

  const collection = state.collections[selectedCollection];

  return (
    <Flex flex="1" w="100%" minHeight="0">
      <Flex w="250px" h="100%" flexDir="column">
        <Sidebar state={state} dispatch={dispatch} />
      </Flex>
      <Flex
        flexDir="column"
        h="100%"
        w="100%"
        px={10}
        pt={6}
        flex="1"
        bg="brand.brightGray"
        borderLeftWidth="1px"
        borderLeftColor="brand.lightBlue"
        overflowY="scroll"
        justify="start"
      >
        <Flex w="100%" pb={6} justify="space-between" align="center">
          <Flex flexDir="column">
            <Heading size="lg">{collection.metadata.name || ''}</Heading>
            <Text fontFamily="mono" color="brand.lightGray">
              {collection.address}
            </Text>
          </Flex>
          <MinterButton
            variant="primaryActionInverted"
            onClick={() => {
              const selectedCollection = state.selectedCollection;
              if (selectedCollection !== null) {
                getContractNfts(system, selectedCollection).then(tokens => {
                  dispatch({
                    type: 'populate_collection',
                    payload: { address: selectedCollection, tokens }
                  });
                });
              }
            }}
          >
            <Box color="currentcolor">
              <RefreshCw size={16} strokeWidth="3" />
            </Box>
            <Text ml={2}>Refresh</Text>
          </MinterButton>
        </Flex>
        <TokenGrid state={state} walletAddress={system.tzPublicKey} />
      </Flex>
    </Flex>
  );
}
