import { connect } from 'react-redux'
import Swap from './swap.component'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import {
  getSwapBlockGasLimit,
  getSwapConversionRate,
  getSwapCurrentNetwork,
  getSwapGasLimit,
  getSwapGasPrice,
  getGasTotal,
  getSwapPrimaryCurrency,
  getSwapToken,
  getSwapTokenContract,
  getSwapAmount,
  getSwapEditingTransactionId,
  getSwapHexDataFeatureFlagState,
  getSwapFromObject,
  getSwapTo,
  getSwapToNickname,
  getSwapTokenBalance,
  getQrSwapsCodeData,
  getSelectedAddress,
  getAddressBook,
} from '../../selectors'

import {
  updateSwapTo,
  updateSwapTokenBalance,
  updateGasData,
  setGasTotal,
  showQrScanner,
  qrCodeDetected,
  updateSwapEnsResolution,
  updateSwapEnsResolutionError,
} from '../../store/actions'
import {
  resetSwapState,
  updateSwapErrors,
} from '../../ducks/swap/swap.duck'
import {
  fetchBasicGasEstimates,
} from '../../ducks/gas/gas.duck'
import { getTokens } from '../../ducks/metamask/metamask'
import {
  calcGasTotal,
} from './swap.utils.js'
import {
  isValidDomainName,
} from '../../helpers/utils/util'

function mapStateToProps (state) {
  const editingTransactionId = getSwapEditingTransactionId(state)

  return {
    addressBook: getAddressBook(state),
    amount: getSwapAmount(state),
    blockGasLimit: getSwapBlockGasLimit(state),
    conversionRate: getSwapConversionRate(state),
    editingTransactionId,
    from: getSwapFromObject(state),
    gasLimit: getSwapGasLimit(state),
    gasPrice: getSwapGasPrice(state),
    gasTotal: getGasTotal(state),
    network: getSwapCurrentNetwork(state),
    primaryCurrency: getSwapPrimaryCurrency(state),
    qrCodeData: getQrSwapsCodeData(state),
    selectedAddress: getSelectedAddress(state),
    swapToken: getSwapToken(state),
    showHexData: getSwapHexDataFeatureFlagState(state),
    to: getSwapTo(state),
    toNickname: getSwapToNickname(state),
    tokens: getTokens(state),
    tokenBalance: getSwapTokenBalance(state),
    tokenContract: getSwapTokenContract(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateAndSetGasLimit: ({
      blockGasLimit,
      editingTransactionId,
      gasLimit,
      gasPrice,
      selectedAddress,
      swapToken,
      to,
      value,
      data,
    }) => {
      !editingTransactionId
        ? dispatch(updateGasData({ gasPrice, selectedAddress, swapToken, blockGasLimit, to, value, data }))
        : dispatch(setGasTotal(calcGasTotal(gasLimit, gasPrice)))
    },
    updateSwapTokenBalance: ({ swapToken, tokenContract, address }) => {
      dispatch(updateSwapTokenBalance({
        swapToken,
        tokenContract,
        address,
      }))
    },
    updateSwapErrors: (newError) => dispatch(updateSwapErrors(newError)),
    resetSwapState: () => dispatch(resetSwapState()),
    scanQrCode: () => dispatch(showQrScanner()),
    qrCodeDetected: (data) => dispatch(qrCodeDetected(data)),
    updateSwapTo: (to, nickname) => dispatch(updateSwapTo(to, nickname)),
    fetchBasicGasEstimates: () => dispatch(fetchBasicGasEstimates()),
    updateSwapEnsResolution: (ensResolution) => dispatch(updateSwapEnsResolution(ensResolution)),
    updateSwapEnsResolutionError: (message) => dispatch(updateSwapEnsResolutionError(message)),
    updateToNicknameIfNecessary: (to, toNickname, addressBook) => {
      if (isValidDomainName(toNickname)) {
        const addressBookEntry = addressBook.find(({ address }) => to === address) || {}
        if (!addressBookEntry.name !== toNickname) {
          dispatch(updateSwapTo(to, addressBookEntry.name || ''))
        }
      }
    },
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Swap)
