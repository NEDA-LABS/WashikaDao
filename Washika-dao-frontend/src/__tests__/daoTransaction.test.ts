import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { useDaoTransaction } from "../hooks/useDaoTransaction";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";

globalThis.alert = vi.fn();

vi.mock("thirdweb/react", () => ({
  useActiveAccount: vi.fn(),
  useSendTransaction: vi.fn(),
}));

vi.mock("thirdweb", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    prepareContractCall: vi.fn(),
    createThirdwebClient: vi.fn(() => ({ clientId: "mockClientId" })),
  };
});

describe("useDaoTransaction", () => {
  const mockActiveAccount = { address: "0xActiveAccountAddress" };
  const mockSendTransaction = vi.fn();
  const mockReceipt = { transactionHash: "0xMockTxHash" };
  const formData = {
    daoName: "Test DAO",
    daoLocation: "Test Location",
    targetAudience: "Developers",
    daoTitle: "Test Title",
    daoDescription: "Test Description",
    daoOverview: "Test Overview",
    daoImageIpfsHash: "QmMockHash",
    multiSigPhoneNo: "123456789",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useActiveAccount as Mock).mockReturnValue(mockActiveAccount);
    (useSendTransaction as Mock).mockReturnValue({ mutate: mockSendTransaction });

    (prepareContractCall as Mock).mockReturnValue({ mock: "preparedTx" });

    mockSendTransaction.mockImplementation((_tx, { onSuccess }) => onSuccess(mockReceipt));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully send the transaction and return the transaction hash", async () => {
    const { result } = renderHook(() => useDaoTransaction());

    const txHash = await act(async () => result.current.handleCreateDao(formData));

    expect(txHash).toBe(mockReceipt.transactionHash);

    expect(prepareContractCall).toHaveBeenCalledTimes(1);
    expect(prepareContractCall).toHaveBeenCalledWith(expect.objectContaining({
      contract: FullDaoContract,
      method: "createDao",
    }));

    expect(mockSendTransaction).toHaveBeenCalledTimes(1);
  });

  it("should handle transaction failure correctly", async () => {
    const errorMessage = "Transaction failed";

    mockSendTransaction.mockImplementation((_tx, { onError }) => onError(new Error(errorMessage)));

    const { result } = renderHook(() => useDaoTransaction());

    await expect(result.current.handleCreateDao(formData)).rejects.toThrow();

    expect(mockSendTransaction).toHaveBeenCalled();
  });
});
