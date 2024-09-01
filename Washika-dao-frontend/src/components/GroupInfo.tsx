import React from "react";

interface GroupData {
  image: string;
  title: string;
  location: string;
  email: string;
  treasuryValue: string;
  description: string;
  memberCount: number;
}

const groupData: GroupData[] = [
  {
    image: "images/jukumu.png",
    title: "KIKUNDI CHAJUKUMU",
    location: "Dar es salaam, Tanzania",
    email: "@JukumuDAO.ETH",
    treasuryValue: "23,000,000",
    description:
      "JUKUMU ni kikundi cha wajasiriamali na wanafanyabiashara wadogo wadogo. Tupo Mburahati, Dar-es-Salaam. Tuna mipango endelevu ya kujenga biashara zetu. Tunanunua hisa, kukopa na kuposha biashara zetu pamoja na elimu za kujijenga kiuchumi",
    memberCount: 48,
  },
  {
    image: "images/hazina.png",
    title: "WANAWAKE WA CCT HAZINA",
    location: "Dodoma, Tanzania",
    email: "@ccthazinaDODOMADAO.ETH",
    treasuryValue: "11,000,000",
    description:
      "WANAWAKE WA CCT - Ni kikundi cha kina mama wa Umoja wa madhehebu ya Kikristo Tanzania. Kikundi hiki ni KIKOBA cha kuwawezesha wanawake wa kikundi hiki kukuza mfunguko wao wa kifedha.",
    memberCount: 28,
  },
  {
    image: "images/jukumu.png",
    title: "KIKUNDI CHA JUKUMU",
    location: "Dar es salaam, Tanzania",
    email: "@JukumuDAO.ETH",
    treasuryValue: "23,000,000",
    description:
      "JUKUMU ni kikundi cha wajasiriamali na wanafanyabiashara wadogo wadogo. Tupo Mburahati, Dar-es-Salaam. Tuna mipango endelevu ya kujenga biashara zetu. Tunanunua hisa, kukopa na kuposha biashara zetu pamoja na elimu za kujijenga kuchumi",
    memberCount: 48,
  },
  {
    image: "images/hazina.png",
    title: "WANAWAKE WA CCT HAZINA",
    location: "Dodoma, Tanzania",
    email: "@ccthazinaDODOMADAO.ETH",
    treasuryValue: "11,000,000",
    description:
      "WANAWAKE WA CCT - Ni kikundi cha kina mama wa Umoja wa madhehebu ya Kikristo Tanzania. Kikundi hiki ni KIKOBA cha kuwawezesha wanawake wa kikundi hiki kukuza mfunguko wao wa kifedha.",
    memberCount: 28,
  },
];

const GroupInfo: React.FC = () => {
  return (
    <div className="groups">
      {groupData.map((group, index) => (
        <div className="group" key={index}>
          <div className="image">
            <img src={group.image} alt={group.title} width={465} />
            <div className="taarifaTop">Taarifa</div>
          </div>
          <div className="section-1">
            <div className="left">
              <h2>{group.title}</h2>
              <div className="location">
                <p>{group.location}</p>
                <img src="images/location.png" width="11" height="13" />
              </div>
              <p className="email">{group.email}</p>
            </div>
            <div className="right">
              <h3>Thamani ya hazina</h3>
              <div>
                <p>TSH</p>
                <p className="amount">{group.treasuryValue}</p>
              </div>
            </div>
          </div>
          <p className="section-2">{group.description}</p>
          <div className="section-3">
            <div className="top">
              <img src="images/profile.png" alt="idadi" />
              <div className="taarifa">Taarifa za wanachama</div>
            </div>
            <div className="bottom">
              <h2>Idadi ya wanachama</h2>
              <p>{group.memberCount}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupInfo;
