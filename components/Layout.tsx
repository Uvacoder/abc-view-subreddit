import {
  Accordion,
  AppShell,
  Burger,
  Button,
  Group,
  Header,
  Kbd,
  List,
  LoadingOverlay,
  MediaQuery,
  Navbar,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRedditContext } from '~/components/RedditProvider';
import { logOut, useSubreddit } from '~/lib/helpers';
import { ChildrenProps } from '~/lib/types';

/**
 * Homepage component.
 */
export default function Layout({ children }: ChildrenProps) {
  const { app, sort, setSort, setSubreddit, subreddit } = useRedditContext();
  const theme = useMantineTheme();
  const { data: session } = useSession();
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState(subreddit);
  const [debounced] = useDebouncedValue(search, 800);
  const { posts, isLoading } = useSubreddit({ subreddit: debounced, sort, shouldFetch: true });

  useEffect(() => {
    setSubreddit(debounced);
  }, [debounced]);

  return (
    <AppShell
      padding="md"
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="xl"
      header={
        <Header height={78} p="lg">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <MediaQuery largerThan="xl" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="md"
                color={theme.colors.gray[6]}
              />
            </MediaQuery>
            <TextInput
              aria-label="subreddit for a subreddit"
              autoComplete="off"
              style={{ width: '100%' }}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="itookapicture"
              value={search}
            />
            <Select
              aria-label="Sort"
              value={sort}
              data={[
                { value: 'hot', label: 'Hot' },
                { value: 'top', label: 'Top' },
                { value: 'rising', label: 'Rising' },
                { value: 'new', label: 'New' },
              ]}
              onChange={setSort}
            />
          </div>
        </Header>
      }
      navbar={
        <Navbar p="md" hiddenBreakpoint="xl" hidden={!opened} width={{ sm: 350 }}>
          {session && (
            <>
              <Navbar.Section>
                <Title order={1} size="h3">
                  Reddit Image Viewer <Kbd>beta</Kbd>
                </Title>
              </Navbar.Section>

              <Navbar.Section grow component={ScrollArea}>
                <Accordion defaultValue="subreddits">
                  <Accordion.Item value="subreddits">
                    <Accordion.Control pl="0">Your Subreddits</Accordion.Control>
                    <Accordion.Panel>
                      <List>
                        {!!app.subs &&
                          app.subs
                            .sort((a, b) => a.toLowerCase().localeCompare(b))
                            .map((sub, index) => (
                              <List.Item key={index}>
                                <Text
                                  component="a"
                                  onClick={() => setSearch(sub)}
                                  style={{ cursor: 'pointer' }}
                                  variant="link"
                                >
                                  {sub.toLowerCase()}
                                </Text>
                              </List.Item>
                            ))}
                      </List>
                    </Accordion.Panel>
                  </Accordion.Item>

                  <Accordion.Item value="multis">
                    <Accordion.Control pl="0">Your Multis</Accordion.Control>
                    <Accordion.Panel>
                      <Accordion pl="0">
                        {!app.multies &&
                          app.multis.map((multi, index) => (
                            <Accordion.Item value={multi.data.name} key={index}>
                              <Accordion.Control pl="0">{multi.data.name}</Accordion.Control>
                              <Accordion.Panel>
                                <List>
                                  {multi.data.subreddits
                                    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name))
                                    .map((sub) => (
                                      <List.Item key={sub.name}>
                                        <Text
                                          component="a"
                                          onClick={() => setSearch(sub.name)}
                                          style={{ cursor: 'pointer' }}
                                          variant="link"
                                        >
                                          {sub.name.toLowerCase()}
                                        </Text>
                                      </List.Item>
                                    ))}
                                </List>
                              </Accordion.Panel>
                            </Accordion.Item>
                          ))}
                      </Accordion>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Navbar.Section>

              <Navbar.Section>
                <Group position="apart" pt="md">
                  <Text>Hello {session.user.name}</Text>
                  <img
                    alt={session.user.name}
                    height={32}
                    loading="lazy"
                    src={session.user.image}
                    width={32}
                  />
                  <Button onClick={() => logOut()}>Sign out</Button>
                </Group>
              </Navbar.Section>
            </>
          )}
          {!session && <Button onClick={() => signIn()}>Sign in</Button>}
        </Navbar>
      }
    >
      {children}
      <LoadingOverlay visible={isLoading} overlayOpacity={0} />
    </AppShell>
  );
}
