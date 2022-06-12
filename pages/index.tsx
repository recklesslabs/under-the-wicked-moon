import {
  AppShell,
  Header,
  MediaQuery,
  Navbar,
  useMantineTheme,
  Text,
  Burger,
  Center,
  Button,
  Box,
  Slider,
  Modal,
  Timeline,
  Tabs,
} from "@mantine/core";
import { BoxSx } from "@mantine/core/lib/components/Box/use-sx/use-sx";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Space } from '@mantine/core';
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected, walletlink, walletconnect } from "../components/connectors";
import { disconnect } from "process";
import { useForm } from "@mantine/hooks";
import { BrandDiscord, BrandInstagram, BrandTwitter } from "tabler-icons-react";

import { Input } from '@mantine/core';
import { NumberInput } from '@mantine/core';
import { Terminal } from 'tabler-icons-react';



import {
  contractABI,
  contractAddress,
  // rinkebyABI,
  // rinkebyAddress,
} from "../components/constants";
import { ethers } from "ethers";
import { useNotifications } from "@mantine/notifications";
const boxTheme = (theme: any): BoxSx => ({
  backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
  textAlign: "center",
  padding: theme.spacing.sm,
  margin: theme.spacing.xs,
  borderRadius: theme.radius.sm,
  cursor: "pointer",
  "&:hover": {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6] // 5 -> 6
        : theme.colors.gray[1],
  },
});

const MARKS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
];

const Home: NextPage = () => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const [craniumTokenId, setCraniumTokenId] = useState();
  const [stallionTokenId, setStallionTokenId] = useState();
  
  const context = useWeb3React();
  const { connector, library, chainId, account, activate, deactivate, active, error } = context;
  const notifications = useNotifications();

  useEffect(() => {
    if (connector !== undefined) {
      setOpened(false);
      console.log(account)
    }
  }, [connector]);

  return (
    
    <AppShell
    
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      // fixed prop on AppShell will be automatically added to Header and Navbar
      fixed
      header={
        <Header height={70} padding="md">
          {/* Handle other responsive styles with MediaQuery component or createStyles function */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <h2>Under The Wicked Moon</h2>

            {account ? (
              <Button onClick={() => deactivate()}>Disconnect Wallet</Button>
            ) : (
              <Button onClick={() => setOpened(true)}>Connect Wallet</Button>
            )}
          </div>
        </Header>
      }
    >
      <div>
      {/* <Image height={"100%"} width={"100%"} src="/Banner.png" /> */}
      </div>
      <Modal centered opened={opened} onClose={() => setOpened(false)} hideCloseButton>
        <Box
          onClick={() => {
            activate(injected);
          }}
          sx={boxTheme(theme)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Metamask</span>
            <Image height="24px" width="24px" alt={"metamask icon"} src={"/Metamask.png"}></Image>
          </div>
        </Box>
        <Box
          onClick={() => {
            activate(walletconnect);
          }}
          sx={boxTheme(theme)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>WalletConnect</span>
            <Image height="24px" width="24px" alt={"walletconnect icon"} src={"/WalletConnect.svg"}></Image>
          </div>
        </Box>
        <Box
          onClick={() => {
            activate(walletlink);
          }}
          sx={boxTheme(theme)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Coinbase Wallet</span>
            <Image height="24px" width="24px" alt={"coinbase wallet icon"} src={"/CoinbaseWallet.svg"}></Image>
          </div>
        </Box>
      </Modal>

      <Center>
        <Box style={{ width: "500px" }} sx={boxTheme(theme)}>
          <div>
          <h2>Mint "Under The Wicked Moon"</h2>
              {account && (
                <p>
                  <a
                    style={{ color: "rgb(55, 111, 188)" }}
                    target="_blank"
                    href={`https://etherscan.io/address/${account}`}
                    rel="noreferrer"
                  >
                    {account}
                  </a>{" "}
                  Connected
                </p>
              )}
              <br />
             <div>
             <NumberInput onChange={(val: any) => setCraniumTokenId(val)} placeholder="Cranium Token ID" hideControls />
             {/* <Input onChange={(val: any) => console.log(val.value)} icon={<Terminal />} placeholder="Cranium Token ID" radius="md" size="xl" /> */}
              <Space h="md" />
              <NumberInput onChange={(val: any) => setStallionTokenId(val)} placeholder="Stallion Token ID" hideControls />
              {/* <Input onChange={(val: any) => console.log(val)} icon={<Terminal />} placeholder="Stallion Token ID" radius="md" size="xl" /> */}
              </div>
              <br />
              <p>
                <Button
                  onClick={() => {
                    let signer: any = library.getSigner(account) as any;
                    const contract = new ethers.Contract(contractAddress, contractABI, signer);
                    contract
                      .claim(craniumTokenId, stallionTokenId)
                      .then((res: any) => {
                        
                        notifications.showNotification({
                          title: `Minting now! 🚀`,
                          message: "You can follow transaction status on Etherscan!",
                        });
                      })
                      .catch((err: any) => {
                        let errStr = typeof err.code === "number" ? err.message : err.toString();
                        console.log(JSON.stringify(err));
                        notifications.showNotification({
                          title: `Error Minting! 🛑`,
                          message: 'Verify token IDs are unclaimed!',
                          color: "red",
                        });
                      });

                    // color: "red",
                  }}
                  disabled={!account}
                >
                  Mint UTWM
                </Button>
                &nbsp; &nbsp;
                <Button
                  onClick={() => {
                    let signer: any = library.getSigner(account) as any;
                    const contract = new ethers.Contract(contractAddress, contractABI, signer);
                    contract
                      .checkTokens(craniumTokenId, stallionTokenId)
                      .then((res: any) => {

                        let [craniumStatus, stallionStatus] = JSON.parse(JSON.stringify(res))

                        if(!craniumStatus || !stallionStatus) {
                          notifications.showNotification({
                            title: `One of more tokens are claimed or invalid!`,
                            message: "You cannot mint them!",
                          });
                        } else {
                          notifications.showNotification({
                            title: `Both tokens are unclaimed!`,
                            message: "You can mint them!",
                          });
                        }
                      })
                      .catch((err: any) => {
                        let errStr = typeof err.code === "number" ? err.message : err.toString();
                        console.log(JSON.stringify(err));
                        notifications.showNotification({
                          title: `Error Checking your tokens! 🛑`,
                          message: 'Verify token IDs are correct!',
                          color: "red",
                        });
                      });
                  }}
                  disabled={!account}
                >
                  Check Tokens
                </Button>
              </p>
          </div>
        
        </Box>
      </Center>
    </AppShell>
  );
};



export default Home;
