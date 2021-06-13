import JSZip from "jszip";

export const m3u = {
  getAttribute(line, attribute) {
    let regex = new RegExp(attribute + '="(.*?)"', "gi");
    let match = regex.exec(line);

    return match && match[1] ? match[1] : "";
  },
  getPlaylistTitle(line) {
    let regex = new RegExp(/^#PLAYLIST:(.*)/, "gi");
    let match = regex.exec(line);

    return match && match[1] ? match[1] : "";
  },
  getName(line) {
    return line.slice(line.lastIndexOf(",") + 1);
  },
  getExtGrp(line) {
    let regex = new RegExp("#EXTGRP:(.*)", "gi");
    let match = regex.exec(line);

    return match && match[1] ? match[1] : "";
  },
  getFileExtension(line) {
    let regex = new RegExp(/(?:\.([^.]+))?$/, "i");
    let match = regex.exec(line);

    return match && match[1] && match[1].length < 5 ? match[1] : "";
  },
  getStreamType(line) {
    if (/.*\/play\/vod\//i.test(line)) {
      return "VOD";
    }
    if (/.*\/movie\//i.test(line)) {
      return "Movie";
    }
    if (/.*\/series\//i.test(line)) {
      return "Series";
    }
    return "Live";
  },
  getYear(name) {
    let regex = new RegExp(/(19\d{2}|20(?:0\d|1[0-9]|2[0-9]))/, "i");
    let match = regex.exec(name);

    return match ? match[1] : "";
  },
  cleanName(name) {
    if (name[name.length - 1] == "-") {
      return name.slice(0, -1).trim();
    } else {
      return name.trim();
    }
  },
  getMovieInfo(name) {
    let regex = new RegExp(
      /^(.+?)[.( \t]*(?:(19\d{2}|20(?:0\d|1[0-9])).*|(?:(?=bluray|\d+p|brrip|webrip)..*)?[.](mkv|avi|mpe?g|mp4)$)/,
      "mi"
    );
    let match = regex.exec(name);
    if (!match) {
      let regex = new RegExp(/(.+)\W(\d{4})?/i);
      match = regex.exec(name);
    }

    return match
      ? {
          name: this.cleanName(match[1]) || "",
          year: match[2] || "",
        }
      : {
          name: name.replace(/ *\([^)]*\) */g, ""),
          year: this.getYear(name),
        };
  },
  getSeriesInfo(name) {
    let regex = new RegExp(
      /^(.+?)([. ])(?:((?:20|19)\d\d)\2)?S(\d+) ?(E(\d+))?(-(E(\d+)))?/,
      "i"
    );
    let match = regex.exec(name);

    return match
      ? {
          name: this.cleanName(match[1]),
          season: match[4],
          episode: match[6],
        }
      : {
          name: name,
          season: "",
          episode: "",
        };
  },
  getSafeFilename(name) {
    return name.replace(/[\\/:*?"<>|]/g, "").trim();
  },
  isExtinfLine(line) {
    return /^#EXTINF/i.test(line);
  },
  isPlaylistLine(line) {
    return /^#PLAYLIST/i.test(line);
  },
  isGrpLine(line) {
    return /^#EXTGRP/i.test(line);
  },
  isURLLine(line) {
    return /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi.test(
      line
    );
  },
  parse(
    content,
    options = { tag: "name", type: ["Movie", "Series", "VOD", "Live"] },
    small = false
  ) {
    return new Promise((resolve, reject) => {
      var lines = content.split("\n");
      var firstLine = lines.shift();

      // Check if the content is a valid m3u file
      if (!firstLine || !/^#EXTM3U/i.test(firstLine)) {
        reject("Playlist is not valid!");
      }

      var playlist = {
        title: "",
        xTvgUrl: this.getAttribute(firstLine, "x-tvg-url"),
        streams: [],
        groups: [],
      };

      // Create new stream
      var stream = Object.create({});

      // Loop through lines and parse line
      for (var i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Playlist title
        if (this.isPlaylistLine(line)) {
          playlist.title = this.getPlaylistTitle(line);
          continue;
        }

        // Group
        if (this.isGrpLine(line)) {
          stream.group = this.getExtGrp(line).trim();
          if (
            stream.group !== "" &&
            playlist.groups.indexOf(stream.group) === -1
          ) {
            playlist.groups.push(stream.group);
          }
          continue;
        }

        // Stream
        if (this.isExtinfLine(line)) {
          stream.name = this.getName(line).trim();
          stream.tvgId = this.getAttribute(line, "tvg-id").trim();
          stream.tvgLogo = this.getAttribute(line, "tvg-logo").trim();
          stream.group = !stream.group
            ? this.getAttribute(line, "group-title").trim()
            : stream.group;

          if (small == false) {
            stream.tvgName = this.getAttribute(line, "tvg-name").trim();
            stream.tvgShift = this.getAttribute(line, "tvg-shift").trim();
            stream.tvgChno = this.getAttribute(line, "tvg-chno").trim();
            stream.channelId = this.getAttribute(line, "channel-id").trim();
            stream.radio =
              this.getAttribute(line, "radio").toLowerCase() === "true";
            stream.parentCode = this.getAttribute(line, "parent-code").trim();
            stream.audioTrack = this.getAttribute(line, "audio-track").trim();
          }

          if (stream.group.trim().length === 0) {
            stream.group = "EMPTY";
          }
          if (
            stream.group !== "" &&
            playlist.groups.indexOf(stream.group) === -1
          ) {
            playlist.groups.push(stream.group);
          }

          continue;
        }

        // URL
        if (this.isURLLine(line)) {
          stream.url = line.trim();
          stream.streamType = this.getStreamType(line);
          stream.extension = this.getFileExtension(line).trim();

          if (stream.streamType === "Movie") {
            stream.movie = this.getMovieInfo(
              options && options.tag ? stream[options.tag] : stream.name
            );
          }

          if (stream.streamType === "Series") {
            stream.series = this.getSeriesInfo(
              options && options.tag ? stream[options.tag] : stream.name
            );
          }

          playlist.streams.push(Object.assign({}, stream));
          stream = Object.create({});
          continue;
        }
      }

      resolve(playlist);
    });
  },
  strm(playlist, options) {
    return new Promise((resolve) => {
      var zip = new JSZip();

      var folder;
      var filename;

      // Create folders where we will store the streams
      playlist.streams.map((stream) => {
        folder =
          stream.group.length > 0
            ? this.getSafeFilename(stream.group)
            : "EMPTY";

        // Movie
        if (
          stream.streamType === "Movie" &&
          options.streamType.includes("Movie") &&
          options.groups.includes(stream.group)
        ) {
          var movieName = stream.movie.name.length
            ? this.getSafeFilename(stream.movie.name)
            : this.getSafeFilename(stream.name);
          var movieYear = stream.movie.year.length
            ? this.getSafeFilename(stream.movie.year)
            : undefined;

          switch (options.format) {
            case "kodi":
              filename =
                movieName && movieYear
                  ? `${movieName} (${movieYear})`
                  : movieName && !movieYear
                  ? movieName
                  : this.getSafeFilename(stream.name);
              break;

            case "original":
              filename = this.getSafeFilename(stream.name);
              break;
          }

          zip.file(`Movies/${folder}/${filename}.strm`, stream.url, {
            createFolders: true,
          });
        }

        // Series
        if (
          stream.streamType === "Series" &&
          options.streamType.includes("Series") &&
          options.groups.includes(stream.group)
        ) {
          var seriesName = stream.series.name.length
            ? this.getSafeFilename(stream.series.name)
            : this.getSafeFilename(stream.name);
          var seriesSeason = stream.series.season.length
            ? this.getSafeFilename(stream.series.season)
            : undefined;
          var seriesEpisode = stream.series.episode.length
            ? this.getSafeFilename(stream.series.episode)
            : undefined;

          switch (options.format) {
            case "kodi":
              filename =
                seriesName && seriesSeason && seriesEpisode
                  ? `${seriesName}/${seriesName} S${seriesSeason}E${seriesEpisode}`
                  : seriesName;
              break;

            case "original":
              filename = seriesName;
              break;
          }

          zip.file(`Series/${folder}/${filename}.strm`, stream.url, {
            createFolders: true,
          });
        }
      });

      resolve(zip);
    });
  },
};
